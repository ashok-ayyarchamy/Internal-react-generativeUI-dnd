"""
Dashboard Component Crew using CrewAI.
Modern implementation using decorators and YAML configuration.
"""

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from langchain_openai import ChatOpenAI
from typing import List, Optional, Dict, Any
import json
import os


@CrewBase
class DashboardCrew:
    """Crew for processing dashboard component requests using modern CrewAI decorators."""

    agents: List[Agent]
    tasks: List[Task]

    def _create_llm(self, llm_config: str):
        """Create LLM instance from configuration string."""
        try:
            if llm_config.startswith("openai/"):
                model = llm_config.replace("openai/", "")
                return ChatOpenAI(model=model)
            # Add other LLM providers as needed
            return ChatOpenAI(model="gpt-4o")
        except Exception as e:
            print(f"⚠️ Warning: Error creating LLM with config '{llm_config}': {e}")
            # Fallback to a basic model
            try:
                return ChatOpenAI(model="gpt-4o")
            except Exception as fallback_error:
                print(f"❌ Critical: Could not create any LLM: {fallback_error}")
                raise fallback_error

    @agent
    def message_planner(self) -> Agent:
        agent_config = self.agents_config["message_planner"].copy()  # type: ignore[index]
        llm = self._create_llm(agent_config.pop("llm", "openai/gpt-4o"))
        return Agent(
            llm=llm,
            **agent_config,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def intent_parser(self) -> Agent:
        agent_config = self.agents_config["intent_parser"].copy()  # type: ignore[index]
        llm = self._create_llm(agent_config.pop("llm", "openai/gpt-4o"))
        return Agent(
            llm=llm,
            **agent_config,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def data_connector(self) -> Agent:
        agent_config = self.agents_config["data_connector"].copy()  # type: ignore[index]
        llm = self._create_llm(agent_config.pop("llm", "openai/gpt-4o"))
        return Agent(
            llm=llm,
            **agent_config,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def component_generator(self) -> Agent:
        agent_config = self.agents_config["component_generator"].copy()  # type: ignore[index]
        llm = self._create_llm(agent_config.pop("llm", "openai/gpt-4o"))
        return Agent(
            llm=llm,
            **agent_config,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def response_generator(self) -> Agent:
        agent_config = self.agents_config["response_generator"].copy()  # type: ignore[index]
        llm = self._create_llm(agent_config.pop("llm", "openai/gpt-4o"))
        return Agent(
            llm=llm,
            **agent_config,
            verbose=True,
            allow_delegation=False,
        )

    @task
    def message_planning_task(self) -> Task:
        task_config = self.tasks_config["message_planning_task"].copy()  # type: ignore[index]
        # Remove the agent and context fields from config as they will be handled by decorators
        if "agent" in task_config:
            del task_config["agent"]
        if "context" in task_config:
            del task_config["context"]
        return Task(
            description=task_config["description"],
            expected_output=task_config["expected_output"],
            agent=self.message_planner(),
            **{
                k: v
                for k, v in task_config.items()
                if k not in ["description", "expected_output", "agent", "context"]
            },
        )

    @task
    def intent_analysis_task(self) -> Task:
        task_config = self.tasks_config["intent_analysis_task"].copy()  # type: ignore[index]
        # Remove the agent and context fields from config as they will be handled by decorators
        if "agent" in task_config:
            del task_config["agent"]
        if "context" in task_config:
            del task_config["context"]
        return Task(
            description=task_config["description"],
            expected_output=task_config["expected_output"],
            agent=self.intent_parser(),
            **{
                k: v
                for k, v in task_config.items()
                if k not in ["description", "expected_output", "agent", "context"]
            },
        )

    @task
    def data_retrieval_task(self) -> Task:
        task_config = self.tasks_config["data_retrieval_task"].copy()  # type: ignore[index]
        # Remove the agent and context fields from config as they will be handled by decorators
        if "agent" in task_config:
            del task_config["agent"]
        if "context" in task_config:
            del task_config["context"]
        return Task(
            description=task_config["description"],
            expected_output=task_config["expected_output"],
            agent=self.data_connector(),
            **{
                k: v
                for k, v in task_config.items()
                if k not in ["description", "expected_output", "agent", "context"]
            },
        )

    @task
    def component_generation_task(self) -> Task:
        task_config = self.tasks_config["component_generation_task"].copy()  # type: ignore[index]
        # Remove the agent and context fields from config as they will be handled by decorators
        if "agent" in task_config:
            del task_config["agent"]
        if "context" in task_config:
            del task_config["context"]
        return Task(
            description=task_config["description"],
            expected_output=task_config["expected_output"],
            agent=self.component_generator(),
            **{
                k: v
                for k, v in task_config.items()
                if k not in ["description", "expected_output", "agent", "context"]
            },
        )

    @task
    def response_generation_task(self) -> Task:
        task_config = self.tasks_config["response_generation_task"].copy()  # type: ignore[index]
        # Remove the agent and context fields from config as they will be handled by decorators
        if "agent" in task_config:
            del task_config["agent"]
        if "context" in task_config:
            del task_config["context"]
        return Task(
            description=task_config["description"],
            expected_output=task_config["expected_output"],
            agent=self.response_generator(),
            **{
                k: v
                for k, v in task_config.items()
                if k not in ["description", "expected_output", "agent", "context"]
            },
        )

    @crew
    def crew(self) -> Crew:
        """Creates the dashboard component crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )

    def _extract_json_from_result(self, result_text: str) -> dict:
        """Extract JSON from agent result text."""
        if not result_text:
            return {}

        try:
            import re
            import json

            # Try to find JSON objects in the text
            json_patterns = [
                r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}",  # Nested JSON objects
                r"\{.*?\}",  # Simple JSON objects
            ]

            for pattern in json_patterns:
                matches = re.findall(pattern, result_text, re.DOTALL)
                for match in matches:
                    try:
                        # Clean up the match
                        cleaned = match.strip()
                        if cleaned.startswith("{") and cleaned.endswith("}"):
                            return json.loads(cleaned)
                    except (json.JSONDecodeError, ValueError):
                        continue

            # If no JSON found, try to extract key-value pairs
            return self._extract_key_value_pairs(result_text)

        except Exception as e:
            print(f"Error extracting JSON from result: {e}")
            return {}

    def _extract_key_value_pairs(self, text: str) -> dict:
        """Extract key-value pairs from text when JSON parsing fails."""
        try:
            import re

            # Look for patterns like "key": "value" or key: value
            pairs = {}
            patterns = [
                r'"([^"]+)"\s*:\s*"([^"]*)"',  # "key": "value"
                r'"([^"]+)"\s*:\s*([^,\s]+)',  # "key": value
                r'([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*"([^"]*)"',  # key: "value"
                r"([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^,\s]+)",  # key: value
            ]

            for pattern in patterns:
                matches = re.findall(pattern, text)
                for key, value in matches:
                    # Clean up the key and value
                    key = key.strip()
                    value = value.strip().strip('"')

                    # Try to convert value to appropriate type
                    if value.lower() in ["true", "false"]:
                        value = value.lower() == "true"
                    elif value.isdigit():
                        value = int(value)
                    elif value.replace(".", "").isdigit():
                        value = float(value)

                    pairs[key] = value

            return pairs

        except Exception as e:
            print(f"Error extracting key-value pairs: {e}")
            return {}

    def process_message(
        self,
        message: str,
        session_id: Optional[str] = None,
        chat_history: Optional[List[Dict[str, Any]]] = None,
    ) -> dict:
        """
        Process user message through the crew workflow with chat history context.

        Args:
            message: The user's natural language message
            session_id: Optional session ID for conversation tracking
            chat_history: Optional list of previous chat messages

        Returns:
            Dict containing response, component_suggestion, and data
        """
        # Handle simple greetings directly without running the full crew
        simple_greetings = [
            "hi",
            "hello",
            "hey",
            "good morning",
            "good afternoon",
            "good evening",
        ]
        message_lower = message.lower().strip()

        if message_lower in simple_greetings:
            print(f"🚀 Simple greeting detected: '{message}' - responding directly")
            return {
                "response": "Hello! I'm your dashboard component assistant. I can help you create charts, tables, metrics, and other dashboard components. Just tell me what you'd like to build!",
                "component_suggestion": {},
                "data": {},
                "intent": {},
            }

        # Check if this is a component request
        component_keywords = [
            "create",
            "build",
            "make",
            "generate",
            "design",
            "chart",
            "table",
            "dashboard",
            "component",
            "visualization",
            "graph",
            "plot",
        ]
        is_component_request = any(
            keyword in message_lower for keyword in component_keywords
        )

        try:
            print(f"🚀 Starting crew processing for message: '{message}'")
            print(f"🔍 Component request detected: {is_component_request}")
            print(
                f"📚 Chat history available: {len(chat_history) if chat_history else 0} previous messages"
            )

            # Create crew based on message type
            if is_component_request:
                print("📋 Creating full crew for component request...")
                crew_instance = self._create_full_crew()
            else:
                print("📋 Creating minimal crew for general query...")
                crew_instance = self._create_minimal_crew()

            # Prepare inputs with chat history context
            inputs = {
                "message": message,
                "session_id": session_id,
                "chat_history": chat_history or [],
                "conversation_context": (
                    self._format_chat_history(chat_history)
                    if chat_history
                    else "No previous conversation context."
                ),
            }
            print(f"📥 Inputs prepared with chat history context")

            # Run the crew
            print("🔄 Starting crew execution...")
            result = crew_instance.kickoff(inputs=inputs)

            print(f"✅ Crew execution completed")
            print(f"📊 Crew result: {result}")  # Debug output

            # The crew returns a single result string with the final response
            response_text = str(result) if result else ""
            print(f"📝 Final response length: {len(response_text)} characters")

            # Check if we got a meaningful response
            if not response_text or response_text.strip() == "":
                response_text = "I understand your message. How can I help you create dashboard components or answer your questions?"

            # For now, return the response text and empty structured data
            # The crew is working well and generating comprehensive responses
            return {
                "response": response_text,
                "component_suggestion": {},
                "data": {},
                "intent": {},
            }

        except Exception as e:
            import traceback

            print(f"❌ Error in process_message: {e}")
            print(f"🔍 Traceback: {traceback.format_exc()}")

            # Provide a more helpful error response
            error_response = f"I apologize, but I encountered an issue processing your request. Please try rephrasing your message or ask me to create a specific dashboard component."

            return {
                "response": error_response,
                "component_suggestion": None,
                "data": None,
                "intent": None,
            }

    def _format_chat_history(self, chat_history: List[Dict[str, Any]]) -> str:
        """Format chat history for inclusion in crew inputs."""
        if not chat_history:
            return "No previous conversation context."

        formatted_history = []
        for i, chat in enumerate(chat_history[-5:], 1):  # Last 5 messages
            user_msg = chat.get("user_message", "")
            agent_msg = chat.get("agent_response", "")

            # Extract key information from the agent response
            intent = chat.get("intent", {})
            component_suggestion = chat.get("component_suggestion", {})

            # Format with more context
            context_info = []
            if intent:
                context_info.append(f"Intent: {intent}")
            if component_suggestion:
                context_info.append(f"Component: {component_suggestion}")

            context_str = f" ({'; '.join(context_info)})" if context_info else ""

            formatted_history.append(
                f'Message {i}: User: "{user_msg}" | Assistant: "{agent_msg}"{context_str}'
            )

        # Add a summary of the conversation
        if len(chat_history) > 5:
            summary = f"\n[Note: This is message {len(chat_history) + 1} in the conversation. Previous {len(chat_history)} messages provide context.]"
        else:
            summary = f"\n[Note: This is message {len(chat_history) + 1} in the conversation.]"

        return "\n".join(formatted_history) + summary

    def _create_minimal_crew(self) -> Crew:
        """Create a minimal crew for general queries (no component creation)."""
        return Crew(
            agents=[self.message_planner(), self.response_generator()],
            tasks=[self.message_planning_task(), self.response_generation_task()],
            process=Process.sequential,
            verbose=True,
        )

    def _create_full_crew(self) -> Crew:
        """Create a full crew for component requests."""
        return Crew(
            agents=[
                self.message_planner(),
                self.intent_parser(),
                self.data_connector(),
                self.component_generator(),
                self.response_generator(),
            ],
            tasks=[
                self.message_planning_task(),
                self.intent_analysis_task(),
                self.data_retrieval_task(),
                self.component_generation_task(),
                self.response_generation_task(),
            ],
            process=Process.sequential,
            verbose=True,
        )
