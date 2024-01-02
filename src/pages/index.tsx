import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { ChainList } from "../components/ChainList";
import { Seo } from "../components/SEO";
import { Web3Provider } from "../context/Web3Context";
import { SearchProvider } from "../context/SearchContext";
import { Layout } from "../components/Layout";

const IndexPage = () => {
  const rawData = useStaticQuery(graphql`
    query ChainsQuery {
      allChain {
        nodes {
          id
          name
          chain
          chainId
          rpc
          icon
          nativeCurrency {
            decimals
            name
            symbol
          }
          explorers {
            url
            name
            standard
          }
          status
          faucets
        }
      }
      allImageSharp {
        nodes {
          id
          gatsbyImageData(width: 40, placeholder: NONE)
          parent {
            id
            ... on File {
              id
              name
            }
          }
        }
      }
      allFile(filter: { extension: { eq: "svg" } }) {
        nodes {
          id
          name
          extension
          publicURL
        }
      }
    }
  `);

  const rawChains = rawData.allChain.nodes.sort(
    (a, b) => a.chainId - b.chainId
  );
  const icons = rawData.allImageSharp.nodes.reduce((acc, node) => {
    acc[node.parent.name] = node.gatsbyImageData;
    return acc;
  }, {});

  const svgIcons = rawData.allFile.nodes.reduce((acc, node) => {
    acc[node.name] = node.publicURL;
    return acc;
  }, {});

  const chains = rawChains.reduce((acc, chain, idx) => {
    acc[idx].icon = icons[chain.icon] ?? svgIcons[chain.icon];
    return acc;
  }, rawChains);

  return (
    <>
      <Seo />
      <Web3Provider>
        <SearchProvider>
          <Layout>
            <ChainList chains={chains} />
          </Layout>
        </SearchProvider>
      </Web3Provider>
    </>
  );
};

export default IndexPage;
