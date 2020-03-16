import React, { useState } from 'react'

import style from './MetaData.module.scss'


function MetaData() {
    const [data] = useState({
        titulo: 'Educast - grava, edita e publica',
        subtitulo: 'Grave as aulas com o Educast',
        data: '13 Agosto',
        local: 'Laboratório Nacional de Engenharia Civil',
        comentario: 'Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário',
        tag: 'Aula de React x',
    });


    return (
        <div>
            <form>
                <div>
                    
                    <div className={style.container}>

                        <label>
                            <h4> Título: </h4>
                            <h5>
                                < input type="text" name="titulo"
                                    value={data.titulo} />
                            </h5>
                        </label>
                        <label>
                            <h4 > Subtítulo: </h4>
                            <h5>
                                < input type="text" name="subtitulo" value={data.subtitulo} />
                            </h5>
                        </label>
                        <label>
                            <h4 > Data: </h4>
                            <h5>
                                < input type="text" name="data" value={data.data} />
                            </h5>
                        </label>
                        <label>
                            <h4 > Local: </h4>
                            <h5>
                                < input type="text" name="local" value={data.local} />
                            </h5>
                        </label>
                    </div>
                    <div className={style.container}>
                        <label>
                            <h4> Comentários: </h4>
                            <h5>
                                < textarea type="textarea" name="comentarios">
                                {data.comentario}
                                </textarea>
                            </h5>
                        </label>
                        <label>
                            <h4> Tags: </h4>
                            <h5>
                                < input type="text" name="tag"
                                    value={data.tag} />
                            </h5>
                        </label>
                    </div>
                    
                    <div className={style.group}></div>
                </div>
            </form>
        </div>
    )
}

export default MetaData
