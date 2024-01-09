export async function ProductosComponent() {
  const response = await fetch('http://localhost:3000/api/products');
  const {newRecords} = await response.json();
  console.log(newRecords);
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
