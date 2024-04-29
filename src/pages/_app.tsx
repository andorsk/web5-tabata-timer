import Layout from "@/components/layout";

// @ts-ignore
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
