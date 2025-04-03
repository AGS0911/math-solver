'use client'
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

import ImageUploader from "@/components/image_uploader";
export default function Home() {
  return (
    <div className = "flex text-center justify-center ">
      <div className = "text-center text-white space-y-4">
        <h1 className = "text-4xl">Ink2Answer</h1>
        <h2 className = "text-2x1 pb-11">Upload an image of your math problem below!</h2>
        <ImageUploader />
      </div>
    </div>
  );
}
