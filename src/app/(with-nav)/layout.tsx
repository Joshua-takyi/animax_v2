import { Navbar } from "@/components/nav";
import Footer from "@/components/footer";
import { Wrapper } from "@/components/wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Wrapper>
        <div className="flex-grow">{children}</div>
      </Wrapper>
      <Footer />
    </main>
  );
}
