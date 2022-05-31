import {
  Box,
  Button,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, VFC } from "react";
import { Canvas } from "./Canvas";

const defaultPts: number[][] = [
  [61, 154],
  [82, 135],
  [97, 138],
  [154, 136],
  [169, 129],
  [195, 146],
  [168, 147],
  [88, 151],
  [88, 165],
  [167, 161],
  [129, 166],
  [131, 197],
  [124, 200],
  [139, 201],
  [127, 205],
  [134, 206],
  [133, 229],
  [63, 120],
  [108, 109],
  [149, 105],
  [193, 116],
  [51, 148],
  [209, 143],
];

const name_pts = [
  "R_eyelash_out",
  "R_eyelash_top",
  "R_eyelash_in",
  "L_eyelash_in",
  "L_eyelash_top",
  "L_eyelash_out",
  "L_eye_center",
  "R_eye_center",
  "R_eye_bottom",
  "L_eye_bottom",
  "nose",
  "mouth_top",
  "mouth_top_R",
  "mouth_top_L",
  "mouth_bottom_R",
  "mouth_bottom_L",
  "chin",
  "R_eyebrow_out",
  "R_eyebrow_in",
  "L_eyebrow_in",
  "L_eyebrow_out",
  "face_R",
  "face_L",
];
export const Main: VFC = () => {
  const [pts, setPts] = useState<number[][]>(defaultPts);
  const [img, setImg] = useState<any>();
  const [idx, setIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const generate = () => {
    setLoading(true);
    axios
      .post("https://mangagen-backend.herokuapp.com/generate", {
        pts: pts,
      })
      .then((res) => {
        setImg(res.data);
      })
      .catch(() => {
        alert("取得に失敗しました");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    generate();
  }, []);
  const box = (index: number, flag: boolean) => {
    const r = 255 - ((index * 50) % 255);
    const g = (index * 50) % 255;
    const b = (index * 80) % 255;

    const color = `rgb(${r}, ${g}, ${b})`;
    const opacity = flag ? "1.0" : "0.6";
    return (
      <Box
        key={index}
        bg={color}
        opacity={opacity}
        w="3xs"
        cursor="pointer"
        onClick={() => {
          setIdx(index);
        }}
      >
        {name_pts[index]}
      </Box>
    );
  };
  return (
    <VStack>
      <SimpleGrid
        columns={{ base: 2, md: 3, lg: 4 }}
        spacing={1}
        textAlign="center"
      >
        {pts.map((pt, index) => box(index, index === idx))}
      </SimpleGrid>
      <HStack>
        <Canvas pts={pts} setPts={setPts} idx={idx} setIdx={setIdx} />
        {loading ? <Spinner /> : <Image src={"data:image/png;base64," + img} />}
      </HStack>
      <Button
        onClick={() => {
          generate();
        }}
      >
        ランダム生成
      </Button>
    </VStack>
  );
};
