import React from 'react';
import BPagination, {Item, Prev, Next, First, Last, Ellipsis} from 'react-bootstrap/lib/Pagination';
import Text from './Text';

export default function Pagination ({data, onSelect}) {
	if (data.totalData === 0) return null;
	let	currentPage = parseInt(data.currentPage),
		pageCount = data.pageCount,
		total = data.totalData,
		start = (currentPage - 1) * data.pageLimit + 1,
		end = Math.min(total, currentPage * data.pageLimit);
	return (
		<div className="pagination-container">
			<div>
				<Text options={{start, end, total}}>Showing [[start]] to [[end]] out of [[total]]</Text>
			</div>
			{
				data.pageCount > 1 &&
				<BPagination>
					{
						currentPage > 1 &&
						<React.Fragment>
							<First onClick={() => onSelect(1)}/>
							<Prev disabled={currentPage === 1} onClick={() => onSelect(currentPage - 1)}/>
						</React.Fragment>
					}
					{currentPage > 2 && <Ellipsis/>}
					{
						currentPage > 1 &&
						<Item onClick={() => onSelect(currentPage - 1)}>{currentPage - 1}</Item>
					}
					<Item active>{currentPage}</Item>
					{
						currentPage < pageCount &&
						<Item onClick={() => onSelect(currentPage + 1)}>{currentPage + 1}</Item>
					}
					{(currentPage < (pageCount - 1)) && <Ellipsis/>}
					{
						currentPage < pageCount &&
						<React.Fragment>
							<Next onClick={() => onSelect(currentPage + 1)}/>
							<Last onClick={() => onSelect(pageCount)}/>
						</React.Fragment>
					}
				</BPagination>
			}
		</div>
	);
}
