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

  const palette = useMemo(
    () => ({
      // ... 保持原有 palette 不變
      guestBtn: "transparent",
      guestText: "#66736C",
    }),
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setError("帳號或密碼錯誤");
    return ;
    if (account === "admin" && password === "1234") {
      localStorage.setItem("auth", "1");
      navigate("/", { replace: true });
      return;
    }
    setError("帳號或密碼錯誤");
  };

  // 新增訪客登入邏輯
  const handleGuestLogin = () => {
    localStorage.setItem("auth", "guest"); // 標記為訪客身分
    navigate("/", { replace: true });
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
              <Heading size="xl" color={palette.text} textAlign="center">
                王幾蛋露營去
              </Heading>              
            </Box>

            <Box h="1px" bg={palette.border} />

            {/* 輸入框區塊 */}
            <Stack spacing="3">
              <Box>
                <Text mb="1" fontSize="sm" color={palette.text} fontWeight="medium">
                  帳號
                </Text>
                <Input
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="輸入帳號"
                  bg="white"
                  borderColor={palette.border}
                  borderRadius="16px"
                  h="44px"
                  
                  _focus={{ borderColor: palette.btn, boxShadow: `0 0 0 1px ${palette.btn}` }}
                  color="black"
                />
              </Box>

              <Box>
                <Text mb="1" fontSize="sm" color={palette.text} fontWeight="medium">
                  密碼
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入密碼"
                  bg="white"
                  borderColor={palette.border}
                  borderRadius="16px"
                  h="44px"
                  _focus={{ borderColor: palette.btn, boxShadow: `0 0 0 1px ${palette.btn}` }}
                  color="black"
                />
              </Box>

              {error && (
                <Box border="1px solid" borderColor="rgba(195,90,90,0.35)" bg="rgba(195,90,90,0.08)" borderRadius="12px" px="3" py="2">
                  <Text fontSize="xs" color={palette.danger}>{error}</Text>
                </Box>
              )}
            </Stack>

            {/* 按鈕組 */}
            <Stack spacing="2" mt="2">
              <Button
                type="submit"
                bg="blue.600"
                color="black"
                borderRadius="18px"
                h="48px"
                fontWeight="bold"
                _hover={{ bg: palette.btnHover }}
                _active={{ transform: "translateY(1px)" }}
              >
                登入系統
              </Button>

              <Button
                variant="outline"
                borderColor={palette.btn}
                color={palette.btn}
                borderRadius="18px"
                h="48px"
                fontWeight="medium"
                bg="gray"
                _hover={{ bg: "rgba(127, 174, 134, 0.1)" }}
                onClick={handleGuestLogin}
              >
                先隨便逛逛 (訪客模式)
              </Button>
            </Stack>

            <Text fontSize="xs" color={palette.muted} textAlign="center">
              還沒有帳號？ 註冊功能施工中 🚧
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}