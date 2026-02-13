import { SimpleGrid, Box, Stack, Text, HStack, Icon } from "@chakra-ui/react";
import { useState } from "react";
// 如果你有安裝 lucide-react 或 react-icons，可以用 ChevronDown
// 這裡用簡單的文字箭頭代替
const ChevronDown = () => <span>▼</span>;

const CategoryBlock = ({ formData, setFormData }) => {
    // 控制開合的狀態，預設關閉 false 或開啟 true
    const [isOpen, setIsOpen] = useState(false);

    const categories = [
        { id: "cooking", label: "炊事與餐廚", icon: "🍳" },
        { id: "furniture", label: "營地家具", icon: "🪑" },
        { id: "sleep", label: "寢室睡眠", icon: "⛺" },
        { id: "electric", label: "燈光電器", icon: "💡" },
        { id: "sanitary", label: "衛生防蟲", icon: "🧴" },
        { id: "others", label: "其他物品", icon: "📦" },
    ];

    return (
        <Stack gap={2} mt={2}>
            {/* 點擊標題區域即可切換開合 */}
            <HStack 
                justify="space-between" 
                cursor="pointer" 
                onClick={() => setIsOpen(!isOpen)}
                _hover={{ opacity: 0.8 }}
            >
                <Text color="#4A3728" fontWeight="bold">
                    選擇分類 {formData.category ? `(已選：${formData.category})` : ""}
                </Text>
                <Box 
                    transition="transform 0.3s" 
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                    color="#4A3728"
                >
                    <ChevronDown />
                </Box>
            </HStack>
        
            {/* 當 isOpen 為 true 時才顯示網格 */}
            {isOpen && (
                <SimpleGrid columns={2} gap={2} animation="fade-in 0.5s">
                    {categories.map((cat) => (
                        <Box
                            key={cat.id}
                            as="button"
                            type="button" // 確保不會觸發 form submit
                            onClick={() => {
                                setFormData(prev => ({ ...prev, category: cat.label }));                                
                            }}
                            p={3}
                            borderRadius="12px"
                            border="2px solid"
                            borderColor={formData.category === cat.label ? "#5B6D5B" : "transparent"}
                            bg={formData.category === cat.label ? "#E8F0E8" : "#FFF9ED"}
                            transition="all 0.2s"
                            _hover={{ bg: "#F0EAD6" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                        >
                            <Text fontSize="sm">{cat.icon}</Text>
                            <Text 
                                fontSize="sm" 
                                fontWeight={formData.category === cat.label ? "bold" : "normal"} 
                                color="#4A3728"
                            >
                                {cat.label}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Stack>
    );
}

export default CategoryBlock;