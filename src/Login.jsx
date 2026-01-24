import React, { useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Image
} from "@chakra-ui/react";
import campingImg from "./assets/camping.png";

export default function Login() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 跟圖片一致的粉彩色系（你可再微調）
  const palette = useMemo(
    () => ({
      pageBgTop: "#EAF4EF",     // 淡薄荷綠天空
      pageBgBottom: "#DDECD8",  // 淡草綠
      cardBg: "#FFF7E9",        // 帳棚奶油色
      border: "#D4E2D5",        // 淡灰綠線
      text: "#2F3A34",          // 深灰綠字
      muted: "#66736C",         // 次要字
      btn: "#7FAE86",           // 草綠按鈕
      btnHover: "#6C9F76",
      danger: "#C35A5A",        // 柔和紅（錯誤）
      inputBg: "#FFFFFF",
    }),
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 示範：先用硬編碼
    if (account === "admin" && password === "1234") {
      localStorage.setItem("auth", "1");
      navigate("/", { replace: true });
      return;
    }
    setError("帳號或密碼錯誤");
  };

  return (
    <Box
      minH="100vh"
      px="5"
      py="10"
      display="flex"
      placeItems="center"
      justifyContent="center"
      bgGradient={`linear(to-b, ${palette.pageBgTop}, ${palette.pageBgBottom})`}
    >
      <Box
        w="100%"
        maxW="420px"
        bg={palette.cardBg}
        border="1px solid"
        borderColor={palette.border}
        borderRadius="24px"
        overflow="hidden"
        boxShadow="0 18px 40px rgba(0,0,0,0.08)"
      >
        {/* 插圖區 */}
        <Box bg="rgba(255,255,255,0.35)">
          <Image
            src={campingImg}
            alt="camping"
            w="100%"
            h="160px"
            objectFit="cover"
          />
        </Box>

        {/* 表單區 */}
        <Box p="6">
          <Stack spacing="4" as="form" onSubmit={onSubmit}>
            <Box>
              <Heading size="2xl" color={palette.text} textAlign="center">
                露營去
              </Heading>
              <Text mt="1" fontSize="sm" color={palette.muted}>
               （測試帳密：admin / 1234）
              </Text>
            </Box>

            <Box h="1px" bg={palette.border} />

            <Stack spacing="3">
              <Box>
                <Text mb="1" fontSize="sm" color={palette.text}>
                  帳號
                </Text>
                <Input
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="輸入帳號"
                  autoComplete="username"
                  bg={palette.inputBg}
                  borderColor={palette.border}
                  borderRadius="16px"
                  _placeholder={{ color: "#9AA7A0" }}
                  _focus={{
                        borderColor: palette.btn,
                        boxShadow: "0 0 0 1px " + palette.btn, // 可選，模擬 focus ring
                    }}
                  color="black"                  
                />
              </Box>

              <Box>
                <Text mb="1" fontSize="sm" color={palette.text}>
                  密碼
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入密碼"
                  autoComplete="current-password"
                  bg={palette.inputBg}
                  borderColor={palette.border}
                  borderRadius="16px"
                  _placeholder={{ color: "#9AA7A0" }}
                  _focus={{
                        borderColor: palette.btn,
                        boxShadow: "0 0 0 1px " + palette.btn, // 可選，模擬 focus ring
                    }}
                  color="black"
                />
              </Box>

              {error ? (
                <Box
                  border="1px solid"
                  borderColor="rgba(195,90,90,0.35)"
                  bg="rgba(195,90,90,0.08)"
                  borderRadius="16px"
                  px="3"
                  py="2"
                >
                  <Text fontSize="sm" color={palette.danger}>
                    {error}
                  </Text>
                </Box>
              ) : null}
            </Stack>

            <Button
              type="submit"
              bg={palette.btn}
              color="white"
              borderRadius="18px"
              h="44px"
              _hover={{ bg: palette.btnHover }}
              _active={{ transform: "translateY(1px)" }}
            >
              登入
            </Button>

            <Text fontSize="xs" color={palette.muted} textAlign="center">
              註冊:施工中
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}