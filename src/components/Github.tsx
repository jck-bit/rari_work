function Github({ username }: { username: string }) {
  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="Github Button"
      title="Check out my GitHub!"
    >
      
    </a>
  );
}

export default Github;
