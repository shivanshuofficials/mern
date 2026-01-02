import React from 'react'
import { X } from 'lucide-react';
const App = () => {
  const [title, setTitle] = React.useState("");
  const [details, setDetails] = React.useState("");

  const [Task, setTask] = React.useState([]);



  const submitHandler = (e) => {
    e.preventDefault();

    const copyTask = [...Task];
    copyTask.push({ title, details });
    setTask(copyTask);


    setTitle("");
    setDetails("");

  }

  const deleteHandler = (idx) => {
    const copyTask = [...Task];
    copyTask.splice(idx, 1);
    setTask(copyTask);
  }

  return (
    <div className='h-screen bg-black text-white lg:flex lg:overflow-hidden'>
      <form onSubmit={(e) => { submitHandler(e) }} className='  flex gap-4 p-10 flex-col  items-start lg:w-1/2'>
        <h1 className='text-4xl font-bold'>Add Notes</h1>
        {/* input for heading */}
        <input type="text" placeholder='Enters Notes Heading' className='px-5 w-full font-medium py-2 border-2 outline-none rounded' value={title} onChange={(e) => setTitle(e.target.value)} />
        {/* deatiled input  */}
        <textarea type="text " className='px-5 w-full font-medium h-32 py-2 flex items-start flex-row border-2 outline-none rounded' placeholder='write Details' value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
        <button className='bg-white  w-full outline-none text-black py-2 px-5 active:scale-95 rounded'>Add note</button>


      </form>
      <div className='lg:w-1/2  lg:border-l-2  p-10'>
        <h1 className='text-4xl font-bold'>Recent Notes</h1>
        <div className='flex flex-wrap items-start justify-start gap-5 mt-5  h-[90%] overflow-auto'>
          {Task.map(function (elem, idx) {
            return <div key={idx} className='flex justify-between flex-col items-start relative h-52 w-40 rounded-xl text-black bg-cover   pt-9 pb-3 px-4 bg-[url(https://imgs.search.brave.com/Sy8UrNAAls611Pvu8Qi3_FVBoZyXVIsAj5GPLUEsNik/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/MTUyLzY3Ny9zbWFs/bC9zdGlja3ktbm90/ZS1wYXBlci1iYWNr/Z3JvdW5kLWZyZWUt/cG5nLnBuZw)]'>
              <div>
                <h3 className='leading-tight text-lg font-bold'>{elem.title}</h3>
                <p className='mt-4 leadiing-tight text-sm font-medium text-gray-500'>{elem.details}</p>

              </div>
              <button onClick={() => deleteHandler(idx)} className='w-full bg-black cursor-pointer active:scale-95 py-1 text-sm text-white rounded font-bold '>Delete Note</button>
            </div>
          })}
        </div>
      </div>

    </div>
  )
}

export default App