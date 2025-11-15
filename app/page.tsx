'use client';
import NavBar from "./components/Navbar";
import OrderForm from "./components/Orderform";


export default function HomePage() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b z-50 flex items-center">
        <NavBar />
      </header>
      <main className="pt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
        <p className="text-2xl mb-8">Enter your phone number and order id as it shows on your reciept.</p>
        <OrderForm />
      </main>
    </>
  );
}
