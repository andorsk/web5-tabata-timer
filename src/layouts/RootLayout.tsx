// import { Providers } from "@/app/providers";

import { store } from "@/lib/store";
import { Provider } from "react-redux";

// @ts-ignore
export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col bg-green-500">
        <div className="z-10 w-full items-center justify-between font-mono text-sm">
          {children}
        </div>
      </main>
    </Provider>
  );
}
