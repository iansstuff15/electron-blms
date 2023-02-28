import remote from '@electron/remote';
// import './TitleBar.css';

function TitleBar() {
  const win = remote.getCurrentWindow();

  const handleMouseDown = (event) => {
    const { screenX, screenY } = event;
    const { x, y } = win.getBounds();

    const offsetX = screenX - x;
    const offsetY = screenY - y;

    const moveHandler = (event) => {
      const { screenX, screenY } = event;
      win.setBounds({ x: screenX - offsetX, y: screenY - offsetY, width: win.getBounds().width, height: win.getBounds().height });
    };

    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  };

  return (
    <div className="title-bar" onMouseDown={handleMouseDown}>
      <div className="title-bar-text">My App</div>
      <div className="title-bar-controls">
        <button onClick={() => win.minimize()}>-</button>
        <button onClick={() => win.maximize()}>+</button>
        <button onClick={() => win.close()}>x</button>
      </div>
    </div>
  );
}

export default TitleBar;