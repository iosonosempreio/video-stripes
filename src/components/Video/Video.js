import styles from "./Video.module.css";
export default function Video({ data }) {
  const bgImage = data.meta.image;
	return (
		<>
			<p>Video: {data.hash}</p>
			<div className={styles.stripe}>
				{Object.keys(data.frames).map((frame) => {
					// console.log(data.frames[frame]);
					const f = data.frames[frame];
					return (
						<div
							key={frame}
							className={styles.frame}
							style={{ width: f.frame.w, height: f.frame.h, backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${bgImage})` }}
						/>
					);
				})}
			</div>
		</>
	);
}
