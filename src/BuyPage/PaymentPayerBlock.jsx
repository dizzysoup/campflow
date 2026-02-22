import { 
  Stack, HStack, Text, Box, Input, IconButton, Button, Select, 
  SelectTrigger, SelectContent, SelectValueText, SelectItem 
} from "@chakra-ui/react";
import { LuPlus, LuTrash2, LuWallet } from "react-icons/lu";

// 誰先付款的分攤區塊
export const PaymentPayerBlock = ({ payers, setPayers, userCollection, totalPrice }) => {
  
  const updatePayer = (index, field, value) => {
    const newPayers = [...payers];
    newPayers[index] = { 
      ...newPayers[index], 
      [field]: field === "amount" ? Number(value) : value 
    };
    setPayers(newPayers);
  };

  const addPayer = () => setPayers([...payers, { user: "", amount: 0 }]);
  const removePayer = (index) => setPayers(payers.filter((_, i) => i !== index));

  const currentPaid = payers.reduce((sum, p) => sum + (p.amount || 0), 0);
  const remaining = totalPrice - currentPaid;

  return (
    <Stack gap={3} p={4} bg="#FDFBF7" borderRadius="20px" border="1px solid #E6E1D6">
      <HStack justify="space-between">
        <HStack color="#4A3728">
          <LuWallet />
          <Text fontWeight="bold">誰先付款 (墊款)</Text>
        </HStack>
        {remaining !== 0 && (
          <Text fontSize="xs" color={remaining > 0 ? "orange.600" : "red.500"}>
            {remaining > 0 ? `尚餘 $${remaining} 未填` : `超出 $${Math.abs(remaining)}`}
          </Text>
        )}
      </HStack>

      <Stack gap={2}>
        {payers.map((payer, index) => (
          <HStack key={index} gap={2}>
            {/* 選擇墊款人 */}
            <Box flex={2}>
              <Select.Root
                collection={userCollection}
                value={[payer.user]}
                onValueChange={(e) => updatePayer(index, "user", e.value[0])}
              >
                <Select.Control>
                  <SelectTrigger bg="white" color="black" borderRadius="12px" border="1px solid #CCC">
                    <SelectValueText placeholder="選擇墊款人"  />
                  </SelectTrigger>
                </Select.Control>
                <Select.Positioner zIndex={7000}>
                  <SelectContent bg="white" color="black" >
                    {userCollection.items.filter(u => u.label !== "全部顯示").map((u) => (
                      <SelectItem item={u} key={u.value} >{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select.Positioner>
              </Select.Root>
            </Box>

            {/* 輸入金額 */}
            <Input
              flex={1}
              type="number"
              placeholder="金額"
              value={payer.amount || ""}
              onChange={(e) => updatePayer(index, "amount", e.target.value)}
              bg="white"
              borderRadius="12px"
              color="black"
              textAlign="center"
            />

            {/* 刪除 (至少保留一個) */}
            {payers.length > 1 && (
              <IconButton 
                variant="ghost" 
                size="sm" 
                colorPalette="red" 
                onClick={() => removePayer(index)}
              >
                <LuTrash2 />
              </IconButton>
            )}
          </HStack>
        ))}
      </Stack>

      <Button 
        size="xs" 
        variant="ghost" 
        color="#5B6D5B" 
        onClick={addPayer}
        border="1px dashed #5B6D5B"
        borderRadius="10px"
      >
        <LuPlus /> 新增墊款人
      </Button>
    </Stack>
  );
};