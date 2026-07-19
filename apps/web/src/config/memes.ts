export interface Meme {
  message: string;
  gifUrl: string;
}

export const providerMemes: Record<string, Meme> = {
  github: {
    message: "Connected via GitHub! We've automatically added random whitespace to your repositories to test your patience.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q1M2I0MGQwNTZkMmVkYTU3NGUzYTNhNWM1OWE1YzkzZjNiYjNlOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufj0uP6I8u2m5y0/giphy.gif"
  },
  discord: {
    message: "Logged in via Discord! We've automatically sent a @everyone ping to all your servers. You're welcome.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2zVr6cu95nF6O4/giphy.gif"
  },
  spotify: {
    message: "Authenticated with Spotify! We've queue-spammed 'Never Gonna Give You Up' on your active device.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kFgzrTt798d2w/giphy.gif"
  },
  credentials: {
    message: "Logged in with standard credentials. How refreshingly vintage! We hope you didn't reuse your banking password.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13HgwGsXF0wDQs/giphy.gif"
  }
};

export const generalMemes: Meme[] = [
  {
    message: "We've secretly replaced your morning coffee with lukewarm decaf.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xGocUH8TCQDDry/giphy.gif"
  },
  {
    message: "Your code is compiling, but your CSS layouts are crying in the corner.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2UlW42qqNY9udwlOke/giphy.gif"
  },
  {
    message: "We added a random 2-second sleep to all page transitions to make the site feel 'expensive'.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif"
  },
  {
    message: "Don't panic! Your computer isn't frozen, our developers are just sleeping.",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FkZjRiNmQxZDAyNDk5NTkxZjg4MjkyNWViOTM4MDRiZTI3MzY0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JE4Yy5cK4T727le/giphy.gif"
  }
];
