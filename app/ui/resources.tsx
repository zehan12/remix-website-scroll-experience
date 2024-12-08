import { Fragment, useEffect, useMemo, useState } from "react";
import { type Resource } from "~/lib/resources.server";
import iconsHref from "~/icons.svg";

import "~/styles/resources.css";

export function InitCodeblock({
  initCommand,
  // Eh, not the best API, but I needed this
  rounded = "full",
}: Pick<Resource, "initCommand"> & {
  rounded?: "full" | "bottom";
}) {
  // Probably a more elegant solution, but this is what I've got
  let [npxOrNpmMaybe, ...otherCode] = initCommand.trim().split(" ");
  let [copied, setCopied] = useState(false);

  // Reset copied state after 4 seconds
  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => setCopied(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <div className="code-block relative">
      <pre
        className={
          rounded === "full"
            ? "rounded-lg"
            : rounded === "bottom"
              ? "rounded-b-lg"
              : undefined
        }
      >
        <code>
          <span className="codeblock-line">
            {["npx", "npm"].includes(npxOrNpmMaybe) ? (
              <>
                <span className="text-blue-500 dark:text-blue-300">
                  {npxOrNpmMaybe}
                </span>{" "}
                <span className="text-green-500 dark:text-yellow-brand">
                  {otherCode.join(" ")}
                </span>
              </>
            ) : (
              <span className="text-green-500 dark:text-yellow-brand">
                {initCommand}
              </span>
            )}
          </span>
        </code>
      </pre>

      <button
        type="button"
        onClick={() => {
          setCopied(true);
          navigator.clipboard.writeText(initCommand);
        }}
        data-code-block-copy
        data-copied={copied}
        className="outline-none"
      >
        {/* had to put these here instead of as a mask so we could add an opacity */}
        <svg
          aria-hidden
          className="h-5 w-5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-gray-100"
          viewBox="0 0 24 24"
        >
          {copied ? (
            <use href={`${iconsHref}#check-mark`} />
          ) : (
            <use href={`${iconsHref}#copy`} />
          )}
        </svg>
        <span className="sr-only">Copy code to clipboard</span>
      </button>
    </div>
  );
}
