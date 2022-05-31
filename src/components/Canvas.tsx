import { useEffect, useState, VFC } from "react";

type Props = {
  pts: number[][];
  setPts: (pts: number[][]) => void;
  idx: number;
  setIdx: (idx: number) => void;
};

type IRect = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};
export const Canvas: VFC<Props> = (props) => {
  const [rect, setRect] = useState<IRect | null>(null);
  useEffect(() => {
    const canvas: any = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    setRect(canvas.getBoundingClientRect());
    const Draw = (x: number, y: number, index: number) => {
      const r = 255 - ((index * 50) % 255);
      const g = (index * 50) % 255;
      const b = (index * 80) % 255;
      ctx.beginPath();
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.arc(x, y, 5, 0, Math.PI * 2, false);
      ctx.fill();
    };

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    props.pts.map((pt, index) => Draw(pt[0], pt[1], index));
  }, [props.pts]);

  const onClickCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    let { clientX: x, clientY: y } = e;

    if (rect) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      let flag = false;
      props.pts.map((pt, index) => {
        if (
          pt[0] > x - 5 &&
          pt[0] < x + 5 &&
          pt[1] > y - 5 &&
          pt[1] < y + 5 &&
          index !== props.idx
        ) {
          props.setIdx(index);
          flag = true;
        }
      });
      if (!flag)
        props.setPts(
          props.pts.map((pt, index) => (index === props.idx ? [x, y] : pt))
        );
    }
  };

  return (
    <canvas
      id="canvas"
      width={"256px"}
      height={"256px"}
      onMouseDown={onClickCanvas}
    />
  );
};
