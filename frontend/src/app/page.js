import Link from "next/link";
export default function Home() {
  return (
    <div>
      <div className="px-5 py-5">
        <Link href="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Login Page
        </Link>
      </div>
      <div className="px-5 py-5">
        <Link href="/auth/signup" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
