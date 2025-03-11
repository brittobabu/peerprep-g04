import Link from "next/link";

export default function () {

  return (
    <div>
      <h1 className="px-14 py-12">
        DashBoard
      </h1>
      <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
       View all Questions
      </Link>
      <Link href="/admin/question" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
       Add new Question
      </Link>
    </div>

  );
}