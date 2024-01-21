import {shoppingCart} from '@/lib/atom';
import {IconCopy} from '@/ui/icons';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useRecoilState} from 'recoil';

export function Modal({closeModal}: {closeModal: (data: boolean) => any}) {
  const [shoppingCartUserData] = useRecoilState(shoppingCart);
  const [textShoppingCopy, setTextShoppingCopy] = useState('');
  const [mostrarDiv, setMostrarDiv] = useState(false);

  useEffect(() => {
    if (shoppingCartUserData) {
      setTextShoppingCopy(
        `Mi pedido:
        ${shoppingCartUserData
          .map((item) => `🖌 ${item.cantidad} ${item.title}`)
          .join('\n')}
        🛒 *Total:  $${
          shoppingCartUserData.reduce(
            (acumalador, objeto) =>
              acumalador + objeto.price * (objeto.cantidad || 1),
            0
          ) || 0
        }*
        `
      );
    }
  }, [shoppingCartUserData]);
  useEffect(() => {
    if (mostrarDiv) {
      const timeout = setTimeout(() => {
        setMostrarDiv(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [mostrarDiv]);
  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative  my-6 mx-auto max-w-3xl w-[95%]'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold'>
                Copie y pegue a Whatsaap
              </h3>
              <button
                className='p-1 ml-auto bg-transparent border-0  opacity-60 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => closeModal(false)}>
                <img src={'/closeBlack.svg'} width={20} />
              </button>
            </div>
            <div className='relative p-6 flex-auto'>
              <div className='my-4 text-blueGray-500 text-lg leading-relaxed'>
                <h3 className='mb-4'>Mi pedido:</h3>
                <div className='max-h-[350px] overflow-auto'>
                  {shoppingCartUserData.length
                    ? shoppingCartUserData.map((item) => (
                        <div key={item.id}>
                          <span className='text-white bg-[#6aa7ff] p-[0.2rem] pl-[0.5rem] pr-[0.5rem] rounded-full'>
                            {item.cantidad}
                          </span>{' '}
                          {item.title}{' '}
                        </div>
                      ))
                    : null}
                </div>
                <div className='flex justify-between mt-4'>
                  <h2 className='font-bold text-1xl'>Total:</h2>
                  <div>
                    <h2 className='font-bold text-1xl'>
                      {shoppingCartUserData
                        .reduce(
                          (acumalador, objeto) =>
                            acumalador + objeto.price * (objeto.cantidad || 1),
                          0
                        )
                        .toLocaleString('es-AR', {
                          style: 'currency',
                          currency: 'ARS',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) || '$ ' + 0}
                    </h2>
                  </div>
                </div>
                <div className='absolute  top-[5%] right-[5%] flex align-center gap-4'>
                  {mostrarDiv && (
                    <div className='bg-[#9bff9b] p-[0.5rem] rounded-lg'>
                      <h3>Pedido copiado</h3>
                    </div>
                  )}
                  <CopyToClipboard text={textShoppingCopy}>
                    <button
                      className='relative  top-[5%] right-[5%]'
                      onClick={() => setMostrarDiv(true)}>
                      <IconCopy />
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
              <button
                className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => closeModal(false)}>
                Seguir comprando
              </button>{' '}
              <Link
                href={
                  'https://api.whatsapp.com/send?phone=+541159102865&text=Hola%20te%20hablo%20desde%20la%20p%C3%A1gina'
                }
                className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 max-sm:text-center'
                onClick={() => closeModal(false)}
                target='_blank'>
                Ir a Whatsaap
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  );
}
