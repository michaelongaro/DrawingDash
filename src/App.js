import React from "react";

import Layout from "./components/layout/Layout";
import AnimatedRoutes from "./ui/AnimatedRoutes";

function App() {
  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  );
}

export default React.memo(App);
