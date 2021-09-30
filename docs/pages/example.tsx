import CommandK from 'components/CommandK';

const Example = () => {
  const config = {
    token: "token",
    // manual hotkeys, nested commands etc
    sources: {
      greets: async (query: string) => {
        const hits = [{
          title: "jonte"          
        },{
          title: "jon",
          hotkeys: "jo"
        }];

        return new Promise((res) => setTimeout(() => res(hits), 500));
      }
    }
  }
  return (
    <div style={{ background: "black", height: "100vh" }}>
      <CommandK config={config} />
    </div>
  )
}

export default Example;
