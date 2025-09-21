import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders blog title and author", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
  }
  render(<Blog blog={blog} />);
  const authorElement = screen.getByText("Test Blog by Test Author");
  expect(authorElement).toBeInTheDocument();
})
