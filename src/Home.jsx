import { Button, HStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";


function Home(){

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  return (
    <>
     <Button>Click me</Button>
     <Button onClick={logout}>登出</Button>
    </>
  )
}

export default Home;