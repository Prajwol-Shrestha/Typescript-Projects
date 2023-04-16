import React, { useState, useRef, useEffect, FormEvent } from 'react'
import Values from 'values.js'
import colorGeneratorStyles from './colorGenerator.module.css'
import copytoclipboard from '../../utils/copytoclipboard'


interface Color{
  type: string,
  hex: string,
  copied: boolean
}

export default function ColorGenerator() {
  const [color, setColor] = useState<string>('#535bf2')
  const [error, setError] = useState<Boolean>(false)
  const [colorArray, setColorArray] = useState<Color[]>([])
  const [copied, setCopied ] = useState<Boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  

  useEffect(() => {
    try {
      const colors = new Values(color).all(10);
      setColorArray(colors.map(color => ({ type: color.type, hex: `#${color.hex.toUpperCase()}`, copied: false })))
      setError(false)
    } catch (err) {
      setError(true)
      console.error(err)
    }
  }, [color])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (inputRef.current) {
      setColor(inputRef.current.value)
    }
  }

  function copy(color: string, index: number): void{
    copytoclipboard(color)
    const newColorArray = [...colorArray]
    newColorArray[index].copied = true
    setColorArray( newColorArray)
    setCopied(true)

    setTimeout(() => {
      newColorArray[index].copied = false
      setColorArray( newColorArray )
      setCopied(false)
    }, 1000)
  }

  return (
    <section className='container'>
      <div className={colorGeneratorStyles.heading_container}>
        <h1> Color Generator  </h1>
        <form onSubmit={handleSubmit}>
          <div className={colorGeneratorStyles.input_container} >
            <input type='text' className='input-field' ref={inputRef} style={{ border: error && '0.5px solid red' }} defaultValue='#535bf2'/>
            <button className='btn' onClick={handleSubmit} > Submit </button>
          </div>
        </form>
      </div>

      <div className={colorGeneratorStyles.colors_container}>
        {colorArray.map((color, index) => (
          <div key={index} className={colorGeneratorStyles.color_card} 
            style={{ backgroundColor: `${color.hex}`, color: color.type === 'tint' ? 'black' : 'white' }} 
            onClick={() => copy(color.hex, index)}
          >
            <p> {color.hex} </p>
            { color.copied && copied && <p> Copied to Clipboard! </p>}
          </div>
        ))}
      </div>
    </section>
  )
}
