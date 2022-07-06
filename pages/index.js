import { AddCircleOutline } from "@mui/icons-material";
import { Button, Container, Grid } from "@mui/material";
import fs from "fs";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import CustomPagination from "../components/Pagination";
import Projects from "../components/Projects";
import SearchComponent from "../components/Search";
import { connectToDatabase } from "../lib/mongodb";
import { setProjects } from "../src/app/slices/projectsSlice";

export async function getServerSideProps(ctx) {
    const accessToken = ctx.req.cookies.access_token;
    if (!accessToken) {
        return {
            redirect: {
                destination: "/sign-in",
                permanent: false,
            },
        };
    }

    try {
        const { currentPage, pageSize } = ctx.query;

        const pageNumber = Number(currentPage);
        const perPage = Number(pageSize);
        const skipParams = (pageNumber - 1) * perPage;
        const projection = {
            projectName: 1,
            projectAddress: 1,
            mainImage: 1,
        };
        const { db } = await connectToDatabase();
        const count = await db.collection("Projects").estimatedDocumentCount();
        const cursor = await db
            .collection("Projects")
            .find(
                {},
                {
                    // sort: {createdAt: -1},
                    skip: skipParams,
                    limit: perPage,
                    // hint: "home_page",
                }
            )
            .project(projection);
        const initialProjects = await cursor.toArray();
        console.log("initialProjects", initialProjects);
        const projects = await initialProjects.map(async (proj) => {
            const image = await fs.promises.readFile(proj.mainImage.src, "base64");
            return {
                ...proj,
                mainImage: {
                    ...proj.mainImage,
                    src: `data:${proj.mainImage.type};base64,${image}`,
                },
            };
        });

        console.log("projects", projects);
        return {
            props: {
                projects,
                count,
                pageNumber,
                perPage,
            },
        };
    } catch (e) {
        console.error({ e });
        return {
            props: {
                projects: [],
            },
        };
    }
}

export default function Home({ projects, count, pageNumber, perPage }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setProjects({ projects, count, pageNumber, perPage }));
    });

    return (
        <>
            <Navbar />
            <Head>
                <title>سجلَات المُحايد</title>
                <meta name="description" content="Al Muhaid Redocrds" />
                <link rel="icon" href="/mceicon.png" />
            </Head>

            <Container maxWidth={"fluid"}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    spacing={{ xs: 1, sm: 2 }}
                    m={"auto"}
                >
                    <Grid item xs={12}>
                        <SearchComponent />
                    </Grid>

                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Link href={"/add-project"}>
                            <Button
                                fullWidth
                                variant={"contained"}
                                size={"large"}
                                startIcon={<AddCircleOutline />}
                            >
                                إضافة مشروع
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={4} />

                    <Grid item xs={12}>
                        <Projects />
                    </Grid>

                    <Grid item xs={12} my={4}>
                        <CustomPagination />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
