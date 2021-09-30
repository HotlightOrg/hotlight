const CommandKLauncher = () => {
  const openHandler = () => {
    const open = new CustomEvent("commandk:open");
    window.dispatchEvent(open);
  }

  return (
    <button
      type="button"
      onClick={openHandler}
    >
      Search everything with CMD+K
    </button>
  )
};

export default CommandKLauncher;

