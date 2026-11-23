import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <p className="text-7xl font-black">404</p>
      <Link href="/shop/" className="mt-6 inline-block font-semibold underline">Back to shop</Link>
    </div>
  );
}
