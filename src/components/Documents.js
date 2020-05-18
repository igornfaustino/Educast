import React, { useState } from 'react';
import './Documents.scss';
import { FaLink } from 'react-icons/fa';
import { AiFillFolderOpen } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';

function Documents() {
	const [documents, setDocuments] = useState([
		{
			title: 'Ola mundo',
			link: 'a fake link1',
		},
		{
			title: 'Ola mundo2',
			link: 'a fake link2',
		},
		{
			title: 'Ola mundo3',
			link: 'a fake link3',
		},
		{
			title: 'Ola mundo3',
			link: 'a fake link4',
		},
		{
			title: 'Ola mundo3',
			link: 'a fake link5',
		},
		{
			title: 'Ola mundo3',
			link: 'a fake link6',
		},
		{
			title: 'Ola mundo3',
			link: 'a fake link7',
		},
		{
			title: 'Ola mundo3',
			link: 'a fake link8',
		},
	]);

	return (
		<div className="general-container">
			<div className="side left">
				<div className="link-upload-container">
					<div className="link-icon-container">
						<FaLink size="1.25rem" color="white" className="link-icon" />
					</div>
					<div className="link-upload-text-container">
						<span className="text">Adicionar o URL de um ficheiro</span>
					</div>
				</div>
				<div className="or-text-container">
					<span className="text">ou</span>
				</div>
				<div className="upload-file-container">
					<div className="folder-icon">
						<AiFillFolderOpen size="4.0rem" color="#0099ff" />
					</div>
					<div>
						<span className="text">Arraste e solte seus documentos</span>
					</div>
				</div>
			</div>
			<div className="side right">
				<div className="list-documents-title-container">
					<span className="list-documents-title-text text">
						Lista de documentos adicionados
					</span>
				</div>
				<div className="list-documents-container">
					{documents.map((document) => {
						return (
							<div key={document.link} className="list-documents-item">
								<span className="text list-documents-item-name">
									{document.title}
								</span>
								<BsTrashFill size="1.75rem" color="#d0d0d0" className="trash-icon"></BsTrashFill>
								<TiEdit size="1.75rem" color="#d0d0d0"></TiEdit>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Documents;
