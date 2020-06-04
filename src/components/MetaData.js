import React, { useState} from "react"

import style from "./MetaData.module.scss"
import InputFields from "./InputFields"
import InputComment from "./InputComment"
import InputChip from "./InputChip"


const MetaData = () => {
    const [data] = useState({
        title: "Educast - grava, edita e publica",
        subtitle: "Grave as aulas com o Educast",
        date: "13 Agosto",
        local: "Laboratório Nacional de Engenharia Civil",
        description: "Comentário",
        tag: ["Aula de React"],
    });


    return (
        <div className={style.metadata}>
            <form>
                <div>

                    <div className={style.container}>
                        <InputFields title="Título" type="text" value={data.title} />
                        <InputFields title="Subtítulo" type="text" value={data.subtitle} />
                        <InputFields title="Data" type="text" value={data.date} />
                        <InputFields title="Local" type="text" value={data.local} />
                    </div>
                    <div className={style.container}>
                        <InputComment title="Descrição" type="text" value={data.description}/>
                        <InputChip title="Tag" type="text" value={data.tag} />
                    </div>

                    <div className={style.group}></div>

                </div>
            </form>
        </div >
    )
}

export default MetaData
