import React from 'react';
import {
	Row,
	Col,
	Pagination,
} from '@sketchpixy/rubix';

export default function RootPagination({data, onSelect}) {
	let start = data.totalData === 0 ? 0 : (data.currentPage - 1) * data.pageLimit + 1,
		end = Math.min(data.totalData, data.currentPage * data.pageLimit);
	return (
		<Row>
			<Col xs={12} md={6}>
				{
					data.totalData !== 0 &&
					<div className="pagination-count-info">
						Showing {start} to {end} out of {data.totalData}
					</div>
				}
			</Col>
			<Col xs={12} md={6}>
				{data.pageCount > 1 &&
					<div className="text-right">
						<Pagination
							prev
							next
							first
							last
							ellipsis
							boundaryLinks
							activePage={data.currentPage}
							items={data.pageCount}
							maxButtons={4}
							onSelect={onSelect}
						/>
					</div>
				}
			</Col>
		</Row>
	);
}