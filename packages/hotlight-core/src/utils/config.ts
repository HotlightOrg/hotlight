// pages
// commands (hotkeys?)
// actions (do something with input), duplicate x
// categories (from own domain), eg. produkter, faq, artiklar
// recents
const config = {
  actions: {
    "duplicate greeting": () => {
      console.log("duplicate");
    },
    "delete greeting": () => {

    },
  },

  // these would normally be scraped
  pages: {
    "How to use Begreet": {
      url: "https://begreet.com/how",
      description: "This is a mighty description aight...",
      category: "Common"
    },
    "The yo page": {
      url: "https://begreet.com/yo",
      description: "This is another thang...",
      category: "Common"
    },
    "About Begreet": {
      url: "https://begreet.com/about",
      description: "This is another thang...",
      category: "About"
    }
  }
}

export default config;
