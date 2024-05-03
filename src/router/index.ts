"use client";
//
// import { PlayScreen } from "@/pages/PlayScreen";
import LoginScreen from "@/pages/LoginScreen";

import { useRouter, Router } from "next/router";

export class RouterService {
  static redirectToLogin(router: Router) {
    router.push("/LoginScreen");
  }
}
