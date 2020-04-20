import React, { useState } from 'react'

import style from './MetaData.module.scss'
import Labels from './Labels'
import LabelComment from './LabelComment'
import LabelChip from './LabelChip'


const MetaData = () => {
    const [data] = useState({
        titulo: 'Educast - grava, edita e publica',
        subtitulo: 'Grave as aulas com o Educast',
        data: '13 Agosto',
        local: 'Laboratório Nacional de Engenharia Civil',
        descricao: 'Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário',
        tag: ['Aula de React'],
    });

    return (
        <div>
            <form>
                <div>

                    <div className={style.container}>
                        <Labels title="Título" type="text" value={data.titulo} />
                        <Labels title="Subtítulo" type="text" value={data.subtitulo} />
                        <Labels title="Data" type="text" value={data.data} />
                        <Labels title="Local" type="text" value={data.local} />
                    </div>
                    <div className={style.container}>
<<<<<<< HEAD
                        <LabelComment title="Descrição" type="text" value={data.descricao} style={[style["textarea-comment"], style["contentarea-comment"]]} minRows={4} maxRows={7} />                      
=======
                        <LabelComment title="Descrição" type="text" value={data.descricao} style={style["textarea-comment"]} minRows={4} maxRows={7} />                      
>>>>>>> 1c433ff056756571acdcf089ce7ee5fc2a435da5
                        <LabelChip title="Tag" type="text" value={data.tag}  minRows={1} maxRows={5} />
                    </div>

                    <div className={style.group}></div>

                </div>
            </form>
        </div >
    )
}

export default MetaData
