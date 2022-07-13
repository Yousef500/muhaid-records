import fs from "fs";
import jwt from "jsonwebtoken";
import {connectToDatabase} from "../../lib/mongodb";

const handler = async (req, res) => {
    const {newProject} = req.body;
    const token = req.cookies.access_token;
    const date = Date.now();

    if (token) {
        const publicKey = await fs.promises.readFile("./src/app/public.pem");
        const verifiedUser = await jwt.verify(token, publicKey, {
            algorithm: "RS256",
        });
        if (verifiedUser?.email && newProject?.projectName) {
            const {projectName} = newProject;
            try {
                const {db} = await connectToDatabase();
                const project = await db
                    .collection("Projects")
                    .findOne({projectName});
                if (project?._id)
                    return res
                        .status(400)
                        .json({message: "المشروع موجود بالفعل"});
                const counter = await db
                    .collection("Counters")
                    .findOneAndUpdate(
                        {_id: "projectId"},
                        {$inc: {sequence_value: 1}}
                    );
                const sequenceValue = counter.value.sequence_value;
                const basePath = `./public/static/images/${sequenceValue}`;
                await fs.promises.mkdir(`${basePath}`, {recursive: true});

                const dbImages = [];
                for (let imageObject of newProject.images) {
                    const base64Image = imageObject.src;
                    const imageBuffer = Buffer.from(
                        base64Image.split("base64,")[1],
                        "base64"
                    );
                    await fs.promises.writeFile(
                        `${basePath}/${imageObject.name}`,
                        imageBuffer
                    );
                    dbImages.push({
                        src: `${basePath}/${imageObject.name}`,
                        name: imageObject.name,
                        type: imageObject.type,
                    });
                }
                // await newProject.images.map(async (imageObject) => {
                //     dbImages.push({
                //         src: `${basePath}/${imageObject.name}`,
                //         name: imageObject.name,
                //         type: imageObject.type,
                //     });
                //     const base64Image = imageObject.src;
                //     const imageBuffer = Buffer.from(base64Image.split("base64,")[1], "base64");
                //     await fs.promises.writeFile(`${basePath}/${imageObject.name}`, imageBuffer);
                // });

                const result = await db.collection("Projects").insertOne({
                    _id: sequenceValue,
                    ...newProject,
                    images: dbImages,
                    createdAt: date,
                    updatedAt: date,
                    mainImage: dbImages[0],
                    // mainImage: newProject.images[0],
                    createdBy: verifiedUser.email,
                    updatedBy: verifiedUser.email,
                });
                if (result.acknowledged) {
                    const createdVisits = await db
                        .collection("ProjectVisits")
                        .insertOne({
                            projectID: sequenceValue,
                            visits: {
                                stageOne: {
                                    done: false,
                                    majorSteps: [
                                        {
                                            name: "الإعداد",
                                            steps: [
                                                {
                                                    name: "التأكد من أن الاساسات لم يتم صبها قبل الفحص",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من تأسيس مواسير المياه (الصرف الصحي ، مياه التغذية)",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من تأسيس وتثبيت قطب التأريض",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من المسافات بين المحاور ومطابقتها مع المخططات",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                        {
                                            name: "الأساسات: أعمال الحفر",
                                            steps: [
                                                {
                                                    name: "الأساس والحفر: التأكد من جودة الأرض المراد البناء عليها",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "ضغط التربة: التأكد من نسبة الضغط الكافية حسب تقرير التربة",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "الانحدار: التأكد من حماية الموقع (الأرض المراد البناء عليها) من دخول المياه السطحية",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                        {
                                            name: "الموقع العام",
                                            steps: [
                                                {
                                                    name: "التأكد من أن مساحة العمل غير ضيقة وأن نسبة الانحدار مناسبة للعمل",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التحقق من حماية الموقع العام حسب اشتراطات الحماية من اختراقات المياه",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من مستوى المياه والمطابقة مع تقرير التربة",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                        {
                                            name: "أعمال إزالة المياه من الأرض المراد البناء عليها",
                                            steps: [
                                                {
                                                    name: "التأكد من التدابير اللازمة لإزالة المياه الجوفية من الأرض المراد البناء عليها",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من التدابير المنفذة للحماية من التلوث الناتج عن دخول مياه صرف المجاورين خلال الحفر",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من منسوب التأسيس حسب تقرير التربة",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                        {
                                            name: "أعمال الخرسانة والخرسانة المسلحة",
                                            steps: [
                                                {
                                                    name: "التأكد من وجود صبة النظافة بما لا يقل عن 10 سم مع تسوية واعداد سطح التربة",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من نظافة وجودة وتماسك القوالب (الشدة الخشبية، الشدة المعدنية...)",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من وجود الغطاء الخرساني بما لا يقل عن  5 سم",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من أبعاد وعدد أقطار حديد التسليح للعناصر الإنشائية ومطابقتها للمخطط",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من المسافة بين القوائم (الجكات) وثبات القوائم (الشدة المعدنية-الشدة الخشبية...)",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: `التأكد من الأبعاد للعناصر الإنشائية بعد الصب وكذلك من عدم وجود تعشيش أو تشققات أو أي عيوب العناصر المصبوية:(صبة النظافة ، خزان الصرف الصحي ، خزان المياه`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: `التأكد من تحقيق مواصفات الخرسانة (نوع الخرسانة / مقاومة الخرسانة / نسبة الماء نيف الخرسانة /
                                                    إضافات على الخرسانة / اختبار الهبوط ...)`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "اشتراطات تنفيد المصعد: التأكد من المقاسات والابعاد حسب المخططات والتأكد من وجود العزل",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                        {
                                            name: "أعمال الصرف الصحي",
                                            steps: [
                                                {
                                                    name: `التأكد من مواصفات المواد المستخدمة في أعمال الصرف الصحي (السباكة): أقطار الأنابيب والمواسير وكذلك أشكال الوصلات بين المواسير والحد الأدنى من المسافة بينهما`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من التقاطعات عند غرف التفتيش وكذلك وجود انخفاض بمقدار لا يزيد عن  15 درجة إلى القناة المركزية الأفقية",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من أشكال وأجزاء الوصلات والقطع الخاصة بالمواسير. يجب استخدام أجزاء 45 درجة",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من أن الميول والتقاطعات عند غرف التفتيش منفذة بشكل صحيح وكذلك وجود انخفاض بمقدار لا يزيد عن 15 درجة الى القناة المركزية الأفقية",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من جودة التركيب وكذلك نوع الدفان المستخدمة لحماية المواسير",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "توضيح مستوى مياه الدعم: التحقق من اجراءات الاختبار",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "التأكد من مقاس وأبعاد غطاء غرفة التفتيش وكذلك وجود وتثبيت الغطاء بشكل صحيح",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "قناة في مستوى المياه الجوفية: الرخصة / ضيق التسرب: التحقق من اجراءات الاختبار وفحص الترخيص",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "خزان الصرف الصحي : التأكد من نفاذية التربة",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "خزان الصرف الصحي : تأكد من حجم فتحة التفريغ",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "خزان الصرف الصحي : تأكد من عمق التثبيت",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "خزان الصرف الصحي : التأكد من منسوب مياه الصرف",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "خزان الصرف الصحي : حماية التلوث: التأكد من كفاية مواد التصفية",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                        {
                                            name: "أعمال تأسيس وتركيبات مياه الصرف الصحي",
                                            steps: [
                                                {
                                                    name: `تأسيس نقاط اتصال، فتحات الصيانة: التأكد من الأبعاد والتأكد من تأسيس نقاط الاتصال وفتحات الصيانة وجميع التركيبات`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            pending: false,
                                            rejected: false,
                                            returned: false,
                                            done: false,
                                        },
                                        {
                                            name: "الأعمال الكهربائية",
                                            steps: [
                                                {
                                                    name: `مزود الطاقة: تأسيس خط اتصال / حماية الأنابيب: التحقق من التركيبات المسبقة (تأسيس مواسير لتمديد الكهرباء)`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            pending: false,
                                            rejected: false,
                                            returned: false,
                                            done: false,
                                        },
                                        {
                                            name: "أعمال الحماية من الصواعق",
                                            steps: [
                                                {
                                                    name: "تأسيس قطب التأريض: التأكد من ثبات قطب التأريض بشكل صحيح",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: "الغطاء الخرساني لا يقل 5 سم: التأكد من تثبيت قطب التأريض بخرسانة لضمان ثباته",
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: `التأريض: قطب التأريض واتصاله بنقاط الاتصال`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                                {
                                                    name: `يجب ان يكون قطب التأريض فتحة بمقاس لا يقل عن 50 سم تحت السطح المساحة: التأكد من وجود مسافة بما يقارب 1 م أمام المبنى، مع وجود الحماية ضد الصدى والتآكل`,
                                                    pending: false,
                                                    rejected: false,
                                                    returned: false,
                                                    done: false,
                                                },
                                            ],
                                            done: false,
                                        },
                                    ],
                                },
                            },
                        });
                    if (createdVisits.acknowledged) {
                        return res.status(201).json();
                    } else {
                        console.log(createdVisits);
                        return res
                            .status(400)
                            .json({message: "لقد حدث خطأ ما"});
                    }
                } else {
                    return res.status(400).json({message: "لقد حدث خطأ ما"});
                }
            } catch (e) {
                console.log({e});
                return res.status(400).json({message: "لقد حدث خطأ ما"});
            }
        }
    } else {
        return res.status(403).json({message: "الرجاء تسجيل الدخول أولا"});
    }
};

export default handler;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "5mb",
        },
    },
};
