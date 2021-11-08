export function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = window.setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

export const underscore = (str1: string, str2: string): string => {
  const str1Array = str1.toLowerCase().split("");
  const str2Array = str2.toLowerCase().split("");

  let lastIndex = 0;
  const underscored = str1Array
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

export const triggerIcon = (trigger): { icon: string; path: string } => {
  const hostname = typeof window === "undefined" ? null : window.location.hostname;

  let icon = null, path = null;
  if(typeof trigger === "function") {
    icon = "action";
  } else if(validURLOrPathname(trigger)) {
    if(trigger[0] === "/") {
      icon = "internal";
      path = trigger;
    } else {
      let url = new URL(trigger);
      if(url.hostname === hostname) {
        icon = "internal";
        path = url.pathname;
      } else {
        icon = "external";
        path = url.hostname + (url.pathname !== "/" ? truncatePath(url.pathname, 16) : "");
      }
    }
  }

  return { icon, path };
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
      //console.warn("URL not valid.", err);
      return false;
    }
  }
  return false;
}

export const truncate = (str: string, length = 10): string => {
  if(!str) {
    return str;
  }

  if(str.length < length) {
    return str;
  }

  const range = (length - 3) / 2; 
  // &hellip;
  return str.slice(0, range) + "..." + str.slice(str.length - range);
}

export const truncatePath = (pathname: string, length = 10): string => {
  const paths = pathname.split("/");
  if(pathname.length < length || paths.length <= 1) {
    return pathname;
  }

  const first = paths.reduce((prev, curr, i) => {
    const sum = prev.sum + curr.length;
    if(sum < length || i === paths.length - 1) {
      return {
        ...prev,
        sum,
        paths: prev.paths.concat(curr)
      }
    } else {
      return {
        ...prev,
        paths: prev.paths.concat(".."),
        sum: 1000 // make sure nothing is added
      }
    }
  }, { paths: [], sum: paths[paths.length-1].length });

  return first.paths.join("/");
}

