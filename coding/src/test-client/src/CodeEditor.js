import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import CodeMirror from "@uiw/react-codemirror"
import "@codemirror/lang-javascript"

const AutoMerge = require('automerge')

function arrayToBase64String(data) {
    let buff = new Buffer.from(data)
    let base64data = buff.toString('base64')
    return base64data
}

function base64StringToArray(s) {
    let result = Buffer.from(s, 'base64')
    return result
}


export default function CodeEditor() {
    let code = useRef()
    const [socket, setSocket] = useState()

    useEffect(() => {
        const s = io("http://localhost:3001")
        setSocket(s)
        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket == null || code == null) return
        const handler = (document) => {
            if (document == null) return
            const doc = base64StringToArray(document)
            code.current = AutoMerge.load(doc)
        }
        socket.on('set-document', handler)
        return () => {
            socket.off('set-document', handler)
        }
    }, [socket, code])

    useEffect(() => {
        if (socket == null || code == null) return
        const handler = (changes) => {
            if (changes == null) return
            code.current = AutoMerge.applyChanges(code.current, base64StringToArray(changes))
        }
        socket.on('receive-changes', handler)
        return () => {
            socket.off('receive-changes', handler)
        }
    }, [socket, code])



    return (<div className="App">
        <header className="App-header"></header>
        <div className="absolute top-20 bottom-40 left-10 right-10 text-left">
            <div>Welcome to the code editor</div>
            <CodeMirror
                value={code.current.code}
                options={{
                    mode: "jsx",
                    theme: "monokai",
                    keyMap: "sublime"
                }}
                onChange={(editor, change) => {
                    if (socket == null || code.current == null || editor == null) return
                    //Text of the editor
                    code.current = AutoMerge.change(code.current, 'Update Code', doc => {
                        doc.code = editor.toString()
                    })
                    console.log()
                    const c = AutoMerge.getLastLocalChange(code.current)
                    const changes = arrayToBase64String(c)
                    socket.emit("text-change", changes)
                }}
            />
        </div>
    </div>)
}