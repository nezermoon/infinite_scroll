import React, { useState, useEffect, useRef } from 'react';
import './List.css';

interface IPost {
	id: number;
	title: string;
	userId: number;
	body: string;
}

const List: React.FC = () => {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [fetching, setFetching] = useState(false);

	const observerRef = useRef<any>();

	const loadMore = () => {
		setCurrentPage((prevState) => prevState + 1);
	};

	useEffect(() => {
		fetch(`https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${currentPage}`)
			.then((response) => response.json())
			.then((data) => {
				setPosts([...posts, ...data]);
			})
			.finally(() => setFetching(true));
	}, [currentPage]);

	useEffect(() => {
		if (fetching) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadMore();
					}
				},
				{ threshold: 0.5 }
			);
			observer.observe(observerRef.current);
		}
	}, [fetching]);

	return (
		<>
			{posts.map((item) => {
				return (
					<div
						className='list-wrapper'
						key={item.id}>
						<div className='list-num'>{item.id + ')'}</div>
						<div className='list-text'>{item.title}</div>
					</div>
				);
			})}
			<div
				className='list-end'
				ref={observerRef}></div>
		</>
	);
};

export default List;
