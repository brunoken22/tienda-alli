'use client';
import {usePathname} from 'next/navigation';
export async function ProductosComponent() {
  const pathname = usePathname();

  const response = await fetch(location.href + 'api/products');
  const {newRecords} = await response.json();
  console.log(pathname.length);

  return (
    <div>
      {newRecords.length}
      {newRecords.map((item: any) => {
        return (
          <div key={item.id}>
            <img src={item.img} alt={item.Name} />
            <h2>{item.Name || 'prueba'} </h2>
          </div>
        );
      })}
    </div>
  );
}
