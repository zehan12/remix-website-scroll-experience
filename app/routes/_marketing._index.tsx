import { type HeadersFunction, data } from "react-router";
import { getMarkdownTutPage, type Prose } from "~/lib/mdtut.server";
import "~/styles/index.css";
import { ScrollExperience } from "~/ui/homepage-scroll-experience";
import invariant from "tiny-invariant";
import { getMeta } from "~/lib/meta";
import { CACHE_CONTROL } from "~/lib/http.server";
import type { Route } from "./+types/_marketing._index";

export function meta({ data }: Route.MetaArgs) {
  let { siteUrl } = data;
  let title = "Remix - Build Better Websites";
  let image = siteUrl ? `${siteUrl}/img/og.1.jpg` : undefined;
  let description =
    "Remix is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience. People are gonna love using your stuff.";

  return getMeta({ title, description, siteUrl, image });
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  let [[, mutations], [, errors]] = await Promise.all([
    getMarkdownTutPage("marketing/mutations/mutations.md"),
    getMarkdownTutPage("marketing/mutations/errors.md"),
  ]);

  invariant(mutations.type === "sequence", "mutations.md should be a sequence");
  invariant(errors.type === "sequence", "errors.md should be a sequence");

  let requestUrl = new URL(request.url);
  let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

  return data(
    {
      siteUrl,
      mutations,
      errors,
    },
    { headers: { "Cache-Control": CACHE_CONTROL.DEFAULT } },
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  // Inherit the caching headers from the loader so we don't cache 404s
  return loaderHeaders;
};

export default function Index({ loaderData }: Route.ComponentProps) {
  let { mutations, errors } = loaderData;
  return (
    <ScrollExperience mutations={mutations} errors={errors} />
  );
}
