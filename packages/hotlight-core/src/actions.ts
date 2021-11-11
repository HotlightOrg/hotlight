import { Actions, Source } from "./typings";

const source: Source = () => {
  return actions;
}

/*
const source2: Source = {
  category: "pull requests",
  request: (query: string) => "https://api.begreet.com?query=" + query
}
*/

type Hit = {
  id: string;
}
const source3: Source = async (query) => {
  const res = await fetch("https://31dgeh4x4m.execute-api.eu-west-1.amazonaws.com/hello?query=" + query)

  if(res.ok) {
    const { message } = await res.json();
    return message.hits.map((hit: Hit) => ({
      title: "" + new Date().getTime() + hit.id,
      trigger: "/"
    }));
  } else {
    return [];
  }
}

export const sources = {
  source,
  //source2,
  source3
};

export const actions: Actions = [
  {
    title: "Add contact",
    description: "Adds a contact to an organisation",
    arguments: [
      "Name",
      {
        placeholder: "Email",
        validator: (value) => value.includes("@") ? [null, null] : [null, "Valid email is required"]
      },
      {
        placeholder: "Organisation",
        options: async (query: string) => {
          return new Promise((resolve, _reject) => {
            resolve([{
              label: "yo",
              value: "string"
            }])
          });
        }
      }
    ],
    trigger: (_, args) => {
      //if(Contact.create(args)) {
        alert("Success!");
      //}
      return ["Success", null];
    }
  },
  { title: "parent", trigger: "/" },
  { title: "child", parentTitle: "parent", trigger: "/" },
  { title: "jonas", trigger: "https://jonas.arnklint.com" },
  { title: "kalle", trigger: "/" },
  { title: "documentation", trigger: "/" },
  { title: "whatsup", trigger: "/" },
]

export const docs = {
  "0": {
    title: "n",
    alias: "",
    hotkey: "n",
    category: "greets"
  },
  "123": {
    title: "New Greet",
    alias: "",
    hotkey: "ng",
    category: "greets"
  },
  "1": {
    title: "kolle",
    alias: "",
    category: "document"
  },
  "2": {
    title: "ada",
    alias: "",
    category: "document"
  },
  "3": {
    title: "remove greet",
    alias: "delete",
    category: "action"
  },
  "4": {
    title: "publish greet",
    alias: "",
    category: "action"
  },
  "5": {
    title: "duplicate greet",
    alias: "",
    category: "document"
  },
  "6": {
    title: "help",
    alias: "? info",
    category: "document"
  },
  "7": {
    title: "send greet to someone",
    alias: "",
    category: "document"
  },
  "8": {
    title: "Draft feedback",
    alias: "",
    category: "greeting"
  },
  "9": {
    title: "Thank someone for feedback",
    alias: "",
    category: "greeting"
  },
  "10": {
    title: "Feedback document",
    alias: "",
    category: "document"
  },
  "11": {
    title: "How much time does this take you?",
    alias: "",
    category: "faq"
  },
  "12": {
    title: "Contact us",
    alias: "mail phone support",
    category: "document"
  },
  "13": {
    title: "New greet",
    alias: "create greet, add greet",
    category: "action"
  },
  "14": {
    title: "Find contact",
    hotkey: "fc",
    category: "contacts"
  }
}
