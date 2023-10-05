import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <SignIn 
      appearance={{
        elements: {
          footerAction: { display: "none"  },
        },
      }}
     />
   );
}
 
export default SignInPage;
