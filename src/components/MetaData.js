import React, { useState } from 'react'

import style from './MetaData.module.scss'
<<<<<<< HEAD
import Labels from './Labels'
import LabelComment from './LabelComment'
import LabelChip from './LabelChip'


const MetaData = () => {
=======


function MetaData() {
>>>>>>> Adicionado componente de metadata
    const [data] = useState({
        titulo: 'Educast - grava, edita e publica',
        subtitulo: 'Grave as aulas com o Educast',
        data: '13 Agosto',
        local: 'Laboratório Nacional de Engenharia Civil',
<<<<<<< HEAD
        descricao: 'Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário',
        tag: ['Aula de React'],
    });

=======
        comentario: 'Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário Comentário',
        tag: 'Aula de React x',
    });


>>>>>>> Adicionado componente de metadata
    return (
        <div>
            <form>
                <div>
<<<<<<< HEAD

                    <div className={style.container}>
                        <Labels title="Título" type="text" value={data.titulo} />
                        <Labels title="Subtítulo" type="text" value={data.subtitulo} />
                        <Labels title="Data" type="text" value={data.data} />
                        <Labels title="Local" type="text" value={data.local} />
                    </div>
                    <div className={style.container}>
                        <LabelComment title="Descrição" type="text" value={data.descricao} style={[style["textarea-comment"], style["contentarea-comment"]]} minRows={4} maxRows={7} />                      
                        <LabelChip title="Tag" type="text" value={data.tag}  minRows={1} maxRows={5} />
                    </div>

                    <div className={style.group}></div>

                </div>
            </form>
        </div >
=======
                    
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
>>>>>>> Adicionado componente de metadata
    )
}

export default MetaData
