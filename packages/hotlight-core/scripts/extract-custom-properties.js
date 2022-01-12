import fs from "fs";
import path from "path";

const re = /var\((--hl-\D*),/;
const valueRe = /var\(--hl-\D*,(.*\))/;

const source = path.join(process.cwd(), "src", "lib");

const files = fs
  .readdirSync(source)
  .filter(file => file.match(/\.svelte$/))

const fromFile = (file) => {
  const allFileContents = fs.readFileSync(path.join(source, file), 'utf-8');

  const extracted = allFileContents
    .split(/\r?\n/)
    .reduce((prev, curr) => {
      const isCustomProperty = curr.match(re);
      let value = curr.match(valueRe);

      if (isCustomProperty) {
        const cleanedValue = value[1].trim().replace(/\)$/, "");
        return {
          [isCustomProperty[1]]: cleanedValue,
          ...prev
        }
      }

      return prev;
    }, {});

  return {
    [file.replace(".svelte", "")]: extracted
  }
}

const customProperties = files
  .map(fromFile)
  .reduce((prev, curr) => {
    return {
      ...prev,
      ...curr
    }
  }, {});

fs.writeFileSync(path.join(process.cwd(), "dist", "custom-properties.json"), JSON.stringify(customProperties), "utf-8");
