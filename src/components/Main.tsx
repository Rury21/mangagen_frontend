import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, VFC } from "react";
import { Canvas } from "./Canvas";

const pts_presets: number[][][] = [
  [
    [76, 117],
    [105, 95],
    [114, 111],
    [167, 117],
    [186, 108],
    [198, 136],
    [180, 130],
    [98, 117],
    [92, 136],
    [176, 148],
    [148, 151],
    [139, 173],
    [108, 167],
    [158, 180],
    [111, 192],
    [145, 198],
    [133, 233],
    [70, 89],
    [130, 95],
    [167, 108],
    [208, 98],
    [48, 108],
    [208, 142],
  ],

  [
    [105, 86],
    [130, 83],
    [142, 92],
    [183, 111],
    [192, 105],
    [201, 117],
    [189, 117],
    [130, 92],
    [123, 105],
    [189, 126],
    [183, 142],
    [161, 176],
    [133, 173],
    [173, 183],
    [136, 183],
    [167, 186],
    [145, 226],
    [117, 67],
    [161, 92],
    [186, 101],
    [208, 98],
    [45, 83],
    [205, 120],
  ],
  [
    [55, 133],
    [67, 126],
    [80, 133],
    [114, 133],
    [139, 130],
    [161, 145],
    [139, 145],
    [73, 142],
    [73, 151],
    [139, 158],
    [86, 164],
    [89, 192],
    [80, 189],
    [114, 192],
    [86, 195],
    [101, 195],
    [89, 230],
    [55, 108],
    [89, 108],
    [114, 105],
    [167, 120],
    [48, 133],
    [195, 148],
  ],
  [
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
  ],
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
  const [pts, setPts] = useState<number[][]>(pts_presets[0]);
  const [img, setImg] = useState<any>();
  const [idx, setIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [noise, setNoise] = useState<number>(0);

  const generate = (cs: boolean) => {
    setLoading(true);
    if (cs)
      axios
        .post("https://mangagen-backend.herokuapp.com/generate", {
          pts: pts,
        })
        .then((res) => {
          setImg(res.data.img);
        })
        .catch(() => {
          alert("取得に失敗しました");
        })
        .finally(() => {
          setLoading(false);
        });
    else
      axios
        .post("https://mangagen-backend.herokuapp.com/generate", {
          pts: pts,
          z: noise,
        })
        .then((res) => {
          setImg(res.data.img);
        })
        .catch(() => {
          alert("取得に失敗しました");
        })
        .finally(() => {
          setLoading(false);
        });
  };
  useEffect(() => {
    generate(false);
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
        w={{ base: "5xs", md: "3xs" }}
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
        {pts_presets.map((pts, index) => (
          <Button
            key={index}
            onClick={() => {
              setPts(pts);
            }}
          >
            preset {index + 1}
          </Button>
        ))}
      </HStack>
      <Divider p={4} />
      <SimpleGrid columns={{ base: 1, md: 2 }} p={4} spacing={8}>
        <Canvas pts={pts} setPts={setPts} idx={idx} setIdx={setIdx} />
        {loading ? (
          <Spinner m={110} size="lg" />
        ) : (
          <Image src={"data:image/png;base64," + img} />
        )}
      </SimpleGrid>
      <Divider p={4} />
      <Heading size="md" p={4}>
        Style
      </Heading>

      <HStack w={{ base: "sm", md: "xl" }}>
        <Slider
          defaultValue={0}
          min={-1.2}
          max={1.2}
          step={0.05}
          colorScheme="teal"
          onChange={(v) => setNoise(v)}
        >
          <SliderTrack>
            <Box position="relative" right={10} />
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>
        <Button
          onClick={() => {
            generate(false);
          }}
        >
          Generate
        </Button>
      </HStack>

      <Button
        onClick={() => {
          generate(true);
        }}
      >
        Generate Random
      </Button>
    </VStack>
  );
};
