let prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
let currentScrollPos = window.pageYOffset;
if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").classList.add("hide-navbar");
    document.getElementById("unordered").classList.add("unordered-class");
    document.getElementById("navbar").classList.remove("show-navbar");
} else {
    document.getElementById("navbar").classList.add("show-navbar");
    document.getElementById("navbar").classList.remove("hide-navbar");
    document.getElementById("unordered").classList.remove("unordered-class");
}
prevScrollpos = currentScrollPos;
}


const repo_title = document.getElementById("repo-title");
let title = "This was done with javascript";

fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
        Authorization: 'bearer  7ed7a858f7d7e43990da1dc5bc52ef31a4e9611a '
    },
    body: JSON.stringify({
        variables: {
            "username": "princess-jewel",
            "count": 20
        },
        query: `query($username: String!, $count: Int!) {
                repositoryOwner(login: $username) {
                    ... on User {
                    repositories(last: $count) {
                        totalCount
                        edges {
                        node {
                            name
                            description
                            url
                            stargazerCount
                            primaryLanguage {
                            name
                            color
                            }
                            forkCount
                            updatedAt
                        }
                        }
                    }
                    }
                }
            }`
    })
}).then(res => res.json()).then(data => {
    
        let response = data.data.repositoryOwner.repositories.edges.reverse().map(repo => {
            // repo_title.innerText = repo.node.name
            let updated_at = new Date(repo.node.updatedAt);
            return `
            <div class="left-col">
                <p><span id="repo-title">${repo.node.name }</span></p>
                <p>${repo.node.description ?? ''}</p>
                <i class="far fa-star star">Star</i>
                <ul>
                    <li style"display: ${repo.node.primaryLanguage == null ? "none;" : "block"}><i class="fas fa-circle" style="color: ${repo.node.primaryLanguage == null ? "#fff; display: none;" : repo.node.primaryLanguage.color}"></i>${repo.node.primaryLanguage == null ? "" : repo.node.primaryLanguage.name}</li>
                    <li><i class="far fa-star"></i>${repo.node.stargazerCount}</li>
                    <li><i class="fas fa-code-branch"></i>${repo.node.forkCount}</li>
                    <li><p>Updated on ${updated_at.toLocaleString(undefined, {month: "short", day: "numeric"})}</p></li>
                </ul>
            </div>`
        })
        document.querySelector('#repoCount').innerHTML = data.data.repositoryOwner.repositories.totalCount
        document.querySelector('.flex-col').innerHTML = response.join('\n');
    })

function myFunction() {
    let x = document.getElementById("navbar");
    if (x.className === "topNavbar") {
        x.className += " responsive";
    } else {
        x.className = "topNavbar";
    }
    }