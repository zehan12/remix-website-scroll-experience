import { data } from "react-router";
import type { Route } from "./+types/$";


export const loader = async ({ request, params }: Route.LoaderArgs) => {

  try {
    return new Response("Hello World".toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch { }
  throw data({}, { status: 404 });
};

export default function Page() {
  return null;
}
