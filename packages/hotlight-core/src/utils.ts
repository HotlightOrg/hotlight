export const underscore = (str1: string, str2: string): string => {
    const str1Array = str1.toLowerCase().split("");
    const str2Array = str2.toLowerCase().split("");
  
    let lastIndex = 0;
    const underscored: { [key: number]: string } = str1Array
      .reduce((prev, curr) => {
        const index = str2Array.findIndex((y, i) => {
          if(y === curr && i >= lastIndex) {
            lastIndex = i;
            return true;
          }
        });
        
        if(index > -1) {
          return { ...prev, [index]: true }
        } else {
          return prev;
        }
  
      }, { })
  
    return str2
      .split("")
      .map((c, i) => {
        if(underscored[i]) {
          return `<span class="u">${c}</span>`;
        } else {
          return c;
        }
      })
      .join("");
  
  }
  
  export const validURLOrPathname = (url: string): boolean => {
    if(url[0] === "/") {
      return true;
    } else {
      try {
        if(new URL(url, location.href)) {
          return true;
        }
      } catch (err) {
        console.warn("URL not valid.", err);
        return false;
      }
    }
    return false;
  }
