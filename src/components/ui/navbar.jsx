import React from "react";
import { HStack, Button,Image,Box } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import campingImg from "../../assets/camping.png";

const NAV_ITEMS = [
  { key: "home", label: "主頁", path: "/" },
  { key: "rent", label: "租借", path: "/rent" },
  { key: "buy", label: "購買", path: "/buy" },
  { key: "gear", label: "用具", path: "/gear" },
  { key: "claim", label: "報帳", path: "/claim" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box   w="100%">
        <Box bg="rgba(255,255,255,0.35)" > 
           <Image
                src={campingImg}
                alt="camping"
                w="100%"
                h="160px"
                objectFit="cover"
            />
        </Box>
        <HStack
           
            top="0"
            left="0"
            w="100%"
            h="64px"
            spacing="0"
            borderTop="1px solid"
            borderColor="#D4E2D5"
            bg="#FFF7E9"
            zIndex="1000"
        >
        {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;

            return (
            <Button
                key={item.key}
                flex="1"
                h="100%"
                borderRadius="0"
                variant="ghost"
                fontWeight={active ? "bold" : "normal"}
                color={active ? "#2F3A34" : "#66736C"}
                bg={active ? "rgba(127,174,134,0.15)" : "transparent"}
                _hover={{ bg: "rgba(127,174,134,0.25)" }}
                onClick={() => navigate(item.path)}
            >
                {item.label}
            </Button>
            );
        })}
        </HStack>
    </Box>
   
  );
}
